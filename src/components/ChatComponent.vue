<script lang="ts" setup>
import HeaderComponent from "@/components/HeaderComponent.vue";
import MessageDisplayComponent from "@/components/MessageDisplayComponent.vue";
import MessageManagerComponent from "@/components/MessageManagerComponent.vue";
import {getCurrentInstance, nextTick, onBeforeMount, watch} from "vue";
import {Store, useStore} from "vuex";
import myStore from "./../store"
import type Message from "@/Types/Message";
import type Participant from "@/Types/Participant";
import type StateData from "@/Types/StateData";

const props = withDefaults(defineProps<{
	colors: any,
	borderStyle: any,
	linkOptions: any,
	scrollBottom: any,
	chatTitle: string,
	asyncMode: boolean,
	myself: Participant,
	sendImages: boolean,
	placeholder: string,
	timestampConfig: any,
	displayHeader: boolean,
	submitIconSize: number,
	messages: Array<Message>,
	acceptImageTypes: string,
	hideCloseButton: boolean,
	profilePictureConfig: any,
	closeButtonIconSize: string,
	submitImageIconSize: number,
	participants: Array<Participant>,
	loadMoreMessages: Function | null,
}>(), {
	chatTitle: '',
	sendImages: true,
	asyncMode: false,
	submitIconSize: 24,
	displayHeader: true,
	hideCloseButton: false,
	submitImageIconSize: 24,
	acceptImageTypes: 'image/*',
	closeButtonIconSize: '15px',
	placeholder: 'type your message here',
	linkOptions: () => ({
		myself: {},
		others: {}
	}),
	scrollBottom: () => ({
		messageSent: true,
		messageReceived: false
	}),
	profilePictureConfig: () => ({
		others: true,
		myself: false,
		styles: {
			width: '25px',
			height: '25px',
			borderRadius: '50%'
		}
	}),
	borderStyle: () => ({
		topLeft: "10px",
		topRight: "10px",
		bottomLeft: "10px",
		bottomRight: "10px",
	}),
	timestampConfig: () => ({
		format: 'HH:mm',
		relative: false
	}),
})

let store: Store<StateData>;
const emits = defineEmits(['onClose', 'onType', 'onMessageSubmit', 'onImageSelected', 'onImageClicked'])

onBeforeMount(() => {
	getCurrentInstance()?.appContext!.app.use(myStore())

	store = useStore()
	store.dispatch('setMyself', props.myself)
	store.dispatch('setMessages', props.messages)
	store.dispatch('setChatTitle', props.chatTitle)
	store.dispatch('setPlaceholder', props.placeholder)
	store.dispatch('setParticipants', props.participants)
})

watch(props.participants, (value) => store.dispatch('setParticipants', value))

watch(props.myself, (value) => store.dispatch('setMyself', value))

watch(props.messages, (value) => store.commit('setMessages', value))

const onClose = () => (emits("onClose"))

const onType = (e: any) => (emits("onType", e))

const onMessageSubmit = (message: Message) => (emits("onMessageSubmit", message))

const onImageSelected = (data: any) => (emits("onImageSelected", data))

const onImageClicked = (message: Message) => (emits("onImageClicked", message))
</script>

<template>
	<div
		:style="{'border-bottom-left-radius': borderStyle.bottomLeft, 'border-bottom-right-radius': borderStyle.bottomRight, 'border-top-right-radius': borderStyle.topRight, 'border-top-left-radius': borderStyle.topLeft}"
		class="quick-chat-container">
		<HeaderComponent v-if="displayHeader"
		                 :border-style="borderStyle"
		                 :close-button-icon-size="closeButtonIconSize"
		                 :colors="colors"
		                 :hide-close-button="hideCloseButton"
		                 @onClose="onClose()">
			<template #header>
				<slot name="header"></slot>
			</template>
		</HeaderComponent>

		<MessageDisplayComponent :async-mode="asyncMode"
		                         :colors="colors"
		                         :link-options="linkOptions"
		                         :load-more-messages="loadMoreMessages"
		                         :profile-picture-config="profilePictureConfig"
		                         :scroll-bottom="scrollBottom"
		                         :timestamp-config="timestampConfig"
		                         @onImageClicked="onImageClicked"/>

		<MessageManagerComponent :accept-image-types="acceptImageTypes"
		                         :border-style="borderStyle" :colors="colors"
		                         :send-images="sendImages"
		                         :submit-icon-size="submitIconSize"
		                         :submit-image-icon-size="submitImageIconSize"
		                         @onImageSelected="onImageSelected"
		                         @onMessageSubmit="onMessageSubmit"
		                         @onType="onType"/>
	</div>
</template>

<style lang="scss">
.quick-chat-container {
	display: flex;
	width: 100%;
	height: 100%;
	background: #f0eeee;
	flex-direction: column;
	align-items: stretch;
	overflow: hidden;
}
</style>