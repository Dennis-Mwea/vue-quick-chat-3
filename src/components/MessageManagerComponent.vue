<script lang="ts" setup>
import SendIcon from 'vue-material-design-icons/Send.vue';
import ImageIcon from 'vue-material-design-icons/Image.vue';
import {useStore} from "vuex";
import { DateTime } from "luxon";
import {computed, ref} from "vue";

withDefaults(defineProps < {
	colors: any,
	borderStyle: any,
	submitIconSize: number,
	submitImageIconSize: number,
	sendImages: boolean,
	acceptImageTypes: string,
} > (), {
	sendImages: true,
	submitIconSize: 24,
	submitImageIconSize: 24,
	borderStyle: () => ({
		topLeft: "10px",
		topRight: "10px",
		bottomLeft: "10px",
		bottomRight: "10px",
	})
})

const store = useStore()
const textInput = ref<string | null>('')
const userInput = ref<HTMLInputElement | null>(null)
const inputImage = ref<HTMLInputElement | null>(null)

const emits = defineEmits(['onMessageSubmit', 'onType', 'onImageSelected'])

const myself = computed(() => store.state.myself)
const placeholder = computed(() => store.state.placeholder)

const handleType = (e: Event) => (emits("onType", e))

const pickImage = () => (inputImage.value!.click())

const handleImageChange = async (e: any) => {
	const files = e.target!.files
	let message = {
		src: '',
		type: 'image',
		viewed: false,
		uploaded: false,
		content: 'image',
		timestamp: DateTime.local(),
		participantId: myself.value.id,
		preview: URL.createObjectURL(files[0])
	};

	emits("onImageSelected", {file: files[0], message});


	store.dispatch('newMessage', message)
}

const sendMessage = () => {
	textInput.value= userInput.value!.textContent;
	userInput.value!.textContent = '';
	// match characters that are different of spaces, tabs, line breaks...
	const matchNotEmpty = /[^\s]+/i
	// match characters that are between line spaces, tabs, line breaks...
	const contentMatch = textInput.value?.match(/^\s*((.|\n)+?)\s*$/i)
	if (textInput.value && matchNotEmpty.test(textInput.value) && contentMatch) {
		let message = {
			content: contentMatch[1],
			timestamp: DateTime.local(),
			participantId: myself.value.id,
			uploaded: false,
			viewed: false,
			type: 'text'
		};
		emits("onMessageSubmit", message);

		store.dispatch('newMessage', message)
	}
}
</script>

<template>
	<div class="container-message-manager">
		<div class="message-text-box">
			<div ref="userInput" :placeholder="placeholder" class="message-input"
			     contenteditable="true" tabIndex="0" @input="handleType" @keyup.enter.exact="sendMessage"></div>
		</div>

		<div class="container-send-message icon-send-message" @click.prevent="sendMessage">
			<SendIcon :fill-color="colors.submitIcon" :size="submitIconSize"/>
		</div>

		<div v-if="sendImages" class="container-send-message icon-send-message" @click="pickImage">
			<input ref="inputImage" :accept="acceptImageTypes" style="display: none;" type="file"
			       @input="handleImageChange">

			<ImageIcon :fill-color="colors.submitImageIcon" :size="submitImageIconSize"/>
		</div>
	</div>
</template>

<style lang="scss">
.quick-chat-container .container-message-manager {
	height: 65px;
	background: #fff;
	display: flex;
	align-items: center;
	padding: 0 20px 0 20px;
	-webkit-box-shadow: 0px -2px 40px 0px rgba(186, 186, 186, 0.67);
	box-shadow: 0px -2px 40px 0px rgba(186, 186, 186, 0.67);

	.message-text-box {
		padding: 0 10px 0 10px;
		flex: 1;
		overflow: hidden;
	}

	.message-input {
		width: 100%;
		resize: none;
		border: none;
		outline: none;
		box-sizing: border-box;
		font-size: 15px;
		font-weight: 400;
		line-height: 1.33;
		white-space: pre-wrap;
		word-wrap: break-word;
		color: #565867;
		-webkit-font-smoothing: antialiased;
		max-height: 40px;
		bottom: 0;
		overflow: scroll;
		overflow-x: hidden;
		overflow-y: auto;
		text-align: left;
		cursor: text;
		display: inline-block;

		&:empty {
			:before {
				content: attr(placeholder);
				display: block; /* For Firefox */
				filter: contrast(15%);
				outline: none;
			}
		}

		&:focus {
			outline: none;
		}
	}

	.container-send-message {
		margin-left: 10px;

		svg {
			-webkit-box-sizing: content-box;
			box-sizing: content-box;
		}
	}

	.icon-send-message {
		cursor: pointer;
		opacity: 0.7;
		transition: 0.3s;
		border-radius: 11px;
		padding: 8px;

		&:hover {
			opacity: 1;
			background: #eee;
		}
	}
}
</style>