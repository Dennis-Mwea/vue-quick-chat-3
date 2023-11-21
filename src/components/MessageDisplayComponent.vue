<script lang="ts" setup>
import {computed, onMounted, onUpdated, ref} from "vue";
import {useStore} from "vuex";
import MyMessageComponent from "@/components/MyMessageComponent.vue";
import OtherMessageComponent from "@/components/OtherMessageComponent.vue";
import type Message from "@/Types/Message";

const props = withDefaults(
	defineProps<{
		colors: any,
		linkOptions: any,
		asyncMode: boolean,
		timestampConfig: any,
		scrollBottom: any,
		profilePictureConfig: any,
		loadMoreMessages: Function | null,
	}>(), {
		asyncMode: false,
	}
)

const store = useStore()
const loading = ref<boolean>(false)
const updateScroll = ref<boolean>(true)
const lastMessage = ref<Message | null>(null)
const containerMessageDisplay = ref<HTMLInputElement | null>(null)
const emits = defineEmits(['onImageClicked'])

const messages = computed<Array<Message>>(() => store.getters.messages)

const myself = computed(() => store.getters.myself)

onMounted(() => {
	goToBottom()
	containerMessageDisplay.value!.dispatchEvent(new CustomEvent('scroll'));
})

onUpdated(() => {
	if (messages.value.length && !messageCompare(messages.value[messages.value.length - 1], lastMessage.value)) {
		if (updateScroll.value
			|| (props.scrollBottom.messageSent && messages.value[messages.value.length - 1].participantId == myself.value.id)
			|| (props.scrollBottom.messageReceived && messages.value[messages.value.length - 1].participantId != myself.value.id)) {
			goToBottom();
			if (messages.value.length) {
				lastMessage.value = messages.value[messages.value.length - 1]
			}
		}
	}
})

const goToBottom = (): void => {
	let scrollDiv = containerMessageDisplay.value!
	scrollDiv.scrollTop = scrollDiv.scrollHeight

	updateScroll.value = false
}

const updateScrollState = (event: Event & { target: HTMLDivElement }): void => {
	const {scrollTop, clientHeight, scrollHeight} = event.target;
	updateScroll.value = scrollTop + clientHeight >= scrollHeight;

	if (typeof props.loadMoreMessages === 'function' && scrollTop < 20) {
		loading.value = true;
		props.loadMoreMessages((messages: Array<Message>) => {
			//if (Array.isArray(messages) && messages.length > 0) {
			/**
			 * this code will be removed before the next release
			 *
			 * this line is commented because the setMessages is already called
			 * when 'this.messages.unshift(...this.toLoad)' is executed at App.vue line 177
			 * it was executing the same function twice, causing unexpected behavior with Luxon date objects
			 */
			//mutations.setMessages([...messages, ...this.messages]);
			//}
			loading.value = false;
		});
	}
}

/**
 * This function compare two messages without looking at the uploaded propertie.
 * This function has been implemented to prevent chat scrolling down after changing the message from 'uploaded = false' to 'uploaded = true'.
 * @param {Object} message1 the first message object
 * @param {Object} message2 the second message object
 * @return {Boolean} true if the messages are equal and false if they are different
 */
const messageCompare = (message1: Message, message2: Message | null): boolean => {
	/**
	 * if one of the messages are null, you can safely compare the messages with '==='
	 */
	if (!message2 || !message1) {
		return message1 === message2
	}
	/**
	 * compare the immutable properties of a message
	 */
	let participantEqual = message1.participantId == message2.participantId;
	let contentEqual = message1.content == message2.content;
	let timestampEqual = message1.timestamp.valueOf() === message2.timestamp.valueOf();

	return participantEqual && contentEqual && timestampEqual
}

const onImageClicked = (message: Message): void => emits("onImageClicked", message)
</script>

<template>
	<div ref="containerMessageDisplay"
	     :style="{background: colors.message.messagesDisplay.bg}"
	     class="container-message-display"
	     @scroll="updateScrollState">
		<div v-if="loading" class="loader">
			<div class="message-loading"></div>
		</div>

		<div v-for="(message, index) in messages" :key="index" class="message-container">
			<MyMessageComponent v-if="message.myself"
			                    :async-mode="asyncMode"
			                    :colors="colors"
			                    :link-options="linkOptions.myself"
			                    :message="message"
			                    :profile-picture-config="profilePictureConfig"
			                    :timestamp-config="timestampConfig"
			                    @onImageClicked="onImageClicked"/>
			<OtherMessageComponent v-else :async-mode="asyncMode"
			                       :colors="colors"
			                       :link-options="linkOptions.others"
			                       :message="message"
			                       :profile-picture-config="profilePictureConfig"
			                       :timestamp-config="timestampConfig"
			                       @onImageClicked="onImageClicked"/>
		</div>
	</div>
</template>

<style lang="scss">
.quick-chat-container .container-message-display {
	flex: 1;
	overflow-y: scroll;
	overflow-x: hidden;
	display: flex;
	flex-direction: column;
	padding-bottom: 10px;
	max-height: 100%;

	/************** Safari 10.1+ ********************/
	@media not all and (min-resolution: .001dpcm) {
		@supports (-webkit-appearance:none) {
			.message-container {
				display: -webkit-box !important;
			}
		}
	}

	.message-image {
		padding: 6px 10px;
		border-radius: 15px;
		margin: 5px 0 5px 0;
		max-width: 70%;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;

		&-display {
			width: 100%;
			border-radius: 5px;
			cursor: pointer;
			transition: 0.3s ease;

			&:hover {
				opacity: 0.8;
			}
		}
	}

	.message-text > p {
		margin: 5px 0 5px 0;
		font-size: 14px;
	}

	.my-message > .message-timestamp {
		text-align: right;
	}

	/* .my-message {
		justify-content: flex-end;
		padding-right: 15px;
		align-items: flex-end;
	} */

	.other-message {
		justify-content: flex-start;
		padding-left: 15px;
		align-items: flex-start;
	}

	.other-message > .message-text {
		color: #fff;
		border-bottom-left-radius: 0;
	}

	.my-message > .message-text {
		border-bottom-right-radius: 0;
	}

	.message-container {
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
	}

	.message-username {
		font-size: 10px;
		font-weight: bold;
	}

	.icon-sent {
		padding-left: 5px;
		color: rgb(129, 127, 127);
	}

	.message-loading {
		height: 8px;
		width: 8px;
		border: 1px solid rgb(187, 183, 183);
		border-left-color: rgb(59, 59, 59);
		border-radius: 50%;
		margin-left: 5px;
		display: inline-block;
		animation: spin 1.3s ease infinite;
	}

	.loader .message-loading {
		width: 16px;
		height: 16px;
		margin: 5px 0 0 0;
	}

	.img-loading {
		height: 20px;
		width: 20px;
		border: 3px solid #ffffff00;
		border-left-color: #847f7f;
		border-top-color: #847f7f;
		border-radius: 50%;
		margin-left: 5px;
		display: inline-block;
		-webkit-animation: spin 1.0s ease infinite;
		animation: spin 1.0s ease infinite;
		position: absolute;
	}

	.img-overlay {
		opacity: 0.4;
	}

	.message-username-image {
		margin: 10px 10px 0 10px;
		font-size: 12px;
		font-weight: bold;
	}
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>