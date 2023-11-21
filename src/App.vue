<script lang="ts" setup>
import {reactive, ref} from "vue";
import type Message from "@/Types/Message";
import type Participant from "@/Types/Participant";
import ChatComponent from "@/components/ChatComponent.vue";
import type ImageSelectedParams from "@/Types/ImageSelectedProp";

const visible = ref<boolean>(true)
const chatTitle = ref<string>('My chat title')
const placeholder = ref<string>('send your message')
const messages = ref<Array<Message>>([
	{
		content: "Really?! I don't care! Haha",
		participantId: 1,
		timestamp: {year: 2012, month: 3, day: 5, hour: 20, minute: 10, second: 3, millisecond: 123},
		uploaded: true,
		viewed: true,
		type: 'text'
	},
	{
		content: "Really?! I don't care! Haha",
		participantId: 1,
		timestamp: {year: 2012, month: 3, day: 5, hour: 20, minute: 10, second: 3, millisecond: 123},
		uploaded: true,
		viewed: true,
		type: 'text'
	},
	{
		content: "Really?! I don't care! Haha",
		participantId: 1,
		timestamp: {year: 2012, month: 3, day: 5, hour: 20, minute: 10, second: 3, millisecond: 123},
		uploaded: true,
		viewed: true,
		type: 'text'
	},
	{
		content: "Hey, Jhon Doe! How are you today",
		participantId: 1,
		timestamp: {year: 2012, month: 3, day: 5, hour: 20, minute: 10, second: 3, millisecond: 123},
		uploaded: true,
		viewed: true,
		type: 'text'
	},
	{
		content: "Hey, Adam! I'm felling really fine this evening.",
		participantId: 3,
		timestamp: {year: 2012, month: 3, day: 5, hour: 20, minute: 10, second: 3, millisecond: 123},
		uploaded: true,
		viewed: true,
		type: 'text'
	},
	{
		content: "Really?! I don't care! Haha www.google.com",
		participantId: 1,
		timestamp: {year: 2012, month: 3, day: 5, hour: 20, minute: 10, second: 3, millisecond: 123},
		uploaded: true,
		viewed: true,
		type: 'text'
	},
])
let participants = reactive<Array<Participant>>([
	{
		name: 'Arnaldo',
		id: 1,
		profilePicture: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a1/NafSadh_Profile.jpg/768px-NafSadh_Profile.jpg'
	},
	{
		name: 'Adam',
		id: 2,
		profilePicture: 'https://lh3.googleusercontent.com/-G1d4-a7d_TY/AAAAAAAAAAI/AAAAAAAAAAA/AAKWJJPez_wX5UCJztzEUeCxOd7HBK7-jA.CMID/s83-c/photo.jpg'
	}
]);
let myself = reactive<Participant>({
	name: 'John Doe',
	id: 3,
	profilePicture: 'https://lh3.googleusercontent.com/-G1d4-a7d_TY/AAAAAAAAAAI/AAAAAAAAAAA/AAKWJJPez_wX5UCJztzEUeCxOd7HBK7-jA.CMID/s83-c/photo.jpg'
})
let toLoad = reactive<Array<Message>>([
	{
		type: 'text',
		content: 'Hey, John Doe! How are you today?',
		participantId: 2,
		timestamp: {year: 2016, month: 3, day: 5, hour: 10, minute: 10, second: 3, millisecond: 123},
		uploaded: true,
		viewed: true
	},
	{
		type: 'text',
		content: "Hey, Adam! I'm feeling really fine this evening.",
		participantId: 3,
		timestamp: {year: 2016, month: 1, day: 5, hour: 19, minute: 10, second: 3, millisecond: 123},
		uploaded: true,
		viewed: true
	},
])

const asyncMode = true, hideCloseButton = false, closeButtonIconSize = "20px", submitIconSize = 24,
	submitImageIconSize = 24
const linkOptions = {
	myself: {
		className: 'myLinkClass',
		events: {
			click: () => (alert('Link clicked!')),
			mouseover: () => (alert('Link hovered!')),
		},
		format: (value: any, type: any) => {
			if (type === 'url' && value.length > 50) {
				value = value.slice(0, 50) + '…';
			}

			return value;
		}
	},
	others: {
		className: 'othersLinkClass',
		events: {
			click: () => (alert('Link clicked!')),
			mouseover: () => (alert('Link hovered!')),
		},
		format: (value: any, type: any) => {
			if (type === 'url' && value.length > 50) {
				value = value.slice(0, 50) + '…';
			}
			return value;
		}
	}
}
const borderStyle = {
	topLeft: "10px",
	topRight: "10px",
	bottomLeft: "10px",
	bottomRight: "10px",
}
const colors = {
	header: {
		bg: '#d30303',
		text: '#fff'
	},
	message: {
		myself: {
			bg: '#fff',
			text: '#525252'
		},
		others: {
			bg: '#fb4141',
			text: '#fff'
		},
		messagesDisplay: {
			//bg: 'rgb(247, 243, 243)',
			//bg: '#f7f3f3'
			bg: '#f7f3f3'
		}
	},
	submitIcon: '#b91010',
	submitImageIcon: '#b91010',
}
const scrollBottom = {
	messageSent: true,
	messageReceived: false
}
const profilePictureConfig = {
	others: true,
	myself: true,
	styles: {
		width: '30px',
		height: '30px',
		borderRadius: '50%'
	}
}
const timestampConfig = {
	format: 'HH:mm',
	relative: false
}

const onType = () => {
	// eslint-disable-next-line
	console.log('typing');
}

const loadMoreMessages = (resolve: any) => (setTimeout(() => {
	resolve(toLoad)
	//Make sure the loaded messages are also added to our local messages copy or they will be lost
	messages.value.unshift(...toLoad)
	toLoad = [];
}, 1000))

const onMessageSubmit = (message: Message) => {
	/*
	* example simulating an upload callback.
	* It's important to notice that even when your message wasn't send
	* yet to the server you have to add the message into the array
	*/
	messages.value.push(message);

	/*
	* you can update message state after the server response
	*/
	// timeout simulating the request
	setTimeout(() => {
		message.uploaded = true
		message.viewed = true
	}, 2000)
}

const onClose = (param: any) => {
	console.log(param)
	visible.value = false;
}

const addMessage = (): void => {
	/* messages.value.push({
		type: 'text',
		content: 'Update state',
		// myself: false
		participantId: 1,
		timestamp: {year: 2014, month: 3, day: 5, hour: 20, minute: 10, second: 3, millisecond: 123},
		uploaded: false,
		viewed: true
	}) */

	messages.value.push({
		type: 'image',
		preview: null,
		src: 'https://pbs.twimg.com/profile_images/875996174305472512/upM71pVR.jpg',
		content: 'image',
		participantId: 1,
		timestamp: {year: 2014, month: 3, day: 5, hour: 20, minute: 10, second: 3, millisecond: 123},
		uploaded: true,
		viewed: false
	})
}

const addParticipant = () => (participants.push({name: 'Karl', id: 4}))

const changeAllProps = (): void => {
	myself = {name: 'I Qanah', id: 3}
	participants = [
		{name: 'Ibrahim', id: 5},
		{name: 'Ana', id: 6}
	]
	messages.value = [
		{
			type: 'text',
			content: "Really?! I don't care! Haha",
			participantId: 5,
			timestamp: {year: 2012, month: 3, day: 5, hour: 20, minute: 10, second: 3, millisecond: 123},
			uploaded: true,
			viewed: true
		},
		{
			type: 'text',
			content: "Really?! I don't care! Haha",
			participantId: 6,
			timestamp: {year: 2012, month: 3, day: 5, hour: 20, minute: 10, second: 3, millisecond: 123},
			uploaded: true,
			viewed: true
		},
		{
			type: 'text',
			content: "Really?! I don't care! Haha",
			participantId: 3,
			timestamp: {year: 2012, month: 3, day: 5, hour: 20, minute: 10, second: 3, millisecond: 123},
			uploaded: true,
			viewed: true
		}
	]
	toLoad = [
		{
			type: 'text',
			content: 'Hey, John Doe! How are you today?',
			participantId: 6,
			timestamp: {year: 2016, month: 3, day: 5, hour: 10, minute: 10, second: 3, millisecond: 123},
			uploaded: true,
			viewed: true
		},
		{
			type: 'text',
			content: "Hey, Adam! I'm feeling really fine this evening.",
			participantId: 3,
			timestamp: {year: 2016, month: 10, day: 5, hour: 19, minute: 10, second: 3, millisecond: 123},
			uploaded: true,
			viewed: true
		},
	];
	chatTitle.value = 'Change All Participants';
	placeholder.value = 'اكتب رسالتك هنا';
}

const onImageSelected = ({file, message}: ImageSelectedParams) => {
	let src = 'https://pbs.twimg.com/profile_images/875996174305472512/upM71pVR.jpg'
	messages.value.push(message);
	/**
	 * This timeout simulates a requisition that uploads the image file to the server.
	 * It's up to you implement the request and deal with the response in order to
	 * update the message status and the message URL
	 */
	setTimeout((res: any) => {
		message.uploaded = true
		message.src = res.src
	}, 3000, {src});
}

const onImageClicked = (message: Message) => {
	/**
	 * This is the callback function that is going to be executed when some image is clicked.
	 * You can add your code here to do whatever you need with the image clicked. A common situation is to display the image clicked in full screen.
	 */
	console.log('Image clicked', message.src)
}
</script>

<template>
	<div class="content">
		<div class="chat-container">
			<ChatComponent v-if="visible"
			               :accept-image-types="'.png, .jpeg'"
			               :async-mode="asyncMode"
			               :border-style="borderStyle"
			               :chat-title="chatTitle"
			               :close-button-icon-size="closeButtonIconSize"
			               :colors="colors"
			               :hide-close-button="hideCloseButton"
			               :link-options="linkOptions"
			               :load-more-messages="toLoad.length > 0 ? loadMoreMessages : null"
			               :messages="messages"
			               :myself="myself"
			               :participants="participants"
			               :placeholder="placeholder"
			               :profile-picture-config="profilePictureConfig"
			               :scroll-bottom="scrollBottom"
			               :submit-icon-size="submitIconSize"
			               :submit-image-icon-size="submitImageIconSize"
			               :timestamp-config="timestampConfig"
			               display-header
			               send-images
			               @onClose="onClose('param value')"
			               @onImageClicked="onImageClicked"
			               @onImageSelected="onImageSelected"
			               @onMessageSubmit="onMessageSubmit"
			               @onType="onType"/>
		</div>
		<div class="external-controller">
			<div class="controller-btn-container">
				<button class="btn-message" @click="addMessage">Add message</button>
				<button class="btn-participant" @click="addParticipant">Add participant</button>
				<button class="btn-participant" @click="changeAllProps">Change All Props</button>
			</div>

			<div class="message-list">
				<ol>
					<li v-for="(message, index) in messages" :key="index">
						{{ message.content }}
					</li>
				</ol>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}

.content {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	flex-wrap: wrap;
}

.chat-container {
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgb(247, 243, 243);
	padding: 10px 0 10px 0;
	height: 500px;
	width: 350px;
}

.external-controller {
	background: #2c3e50;
	height: 300px;
	width: 600px;
	display: flex;
	color: #eee;
}

.controller-btn-container {
	display: flex;
	justify-content: center;
	align-items: center;
	padding-left: 20px;
	padding-right: 20px;
	flex-wrap: wrap;
}

.btn-message {
	cursor: pointer;
	background: #eee;
	border: none;
	height: 40px;
	color: #2c3e50;
	border-radius: 5px;
	outline: none;
	transition: 0.3s;

	&:hover {
		background: rgb(255, 255, 255);
	}
}

.btn-participant {
	cursor: pointer;
	background: #eee;
	border: none;
	height: 40px;
	color: #2c3e50;
	border-radius: 5px;
	outline: none;
	transition: 0.3s;
}
</style>
