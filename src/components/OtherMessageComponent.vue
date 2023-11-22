<script lang="ts" setup>
import CheckIcon from 'vue-material-design-icons/Check.vue';
import CheckAll from 'vue-material-design-icons/CheckAll.vue';
import {computed, onMounted, ref} from "vue";
import type Message from "@/Types/Message";
import {useStore} from "vuex";
import linkifyElement from "linkifyjs/element";

const props = withDefaults(defineProps<{
	colors: any,
	message: Message,
	linkOptions: any,
	asyncMode: boolean,
	timestampConfig: any,
	profilePictureConfig: any,
}>(), {
	asyncMode: false
})

const store = useStore()
const emits = defineEmits(['onImageClicked'])
const messageContent = ref<HTMLElement | null>(null)
const getParticipantById = computed(() => store.getters.getParticipantById)

onMounted(() => {
	if (messageContent.value != null) {
		(linkifyElement as Function)(messageContent.value, props.linkOptions, document)
	}
})

const onImageClicked = (message: Message) => (emits("onImageClicked", message))
</script>

<template>
	<div class="other-message-body">
		<div v-if="profilePictureConfig.others" class="thum-container">
			<img :src="getParticipantById(message.participantId)?.profilePicture" :style="{'width': profilePictureConfig.styles.width, 'height': profilePictureConfig.styles.height, 'border-radius': profilePictureConfig.styles.borderRadius}"
			     class="participant-thumb">
		</div>
		<div class="message-content">
			<template v-if="message.type == 'image'">
				<p class="message-username-image">{{ getParticipantById(message.participantId)?.name }}</p>
				<div v-if="message.uploaded" class="message-image">
					<img :src="message.src" alt="" class="message-image-display" @click="onImageClicked(message)">
				</div>
				<div v-else class="message-image">
					<img :src="message.preview!" alt="" class="message-image-display img-overlay">
					<div class="img-loading"></div>
				</div>
			</template>
			<template v-else>
				<div :style="{background: colors.message.others.bg, color: colors.message.others.text}"
				     class="message-text">
					<p class="message-username">{{ getParticipantById(message.participantId)?.name }}</p>
					<p ref="messageContent">{{ message.content }}</p>
				</div>
			</template>
			<div :style="{'justify-content': 'baseline'}" class="message-timestamp">
				<template v-if="timestampConfig.relative">
					{{ message.timestamp.toRelative() }}
				</template>
				<template v-else>
					{{ message.timestamp.toFormat(timestampConfig.format) }}
				</template>
				<CheckIcon v-if="asyncMode && message.uploaded && !message.viewed" :size="14" class="icon-sent"/>
				<CheckAll v-else-if="asyncMode && message.uploaded && message.viewed" :size="14"
				          class="icon-sent viewed"/>
				<div v-else-if="asyncMode" class="message-loading"></div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.container-message-display .other-message-body {
	display: flex;
	align-items: flex-end;
	padding-left: 10px;

	.message-content {
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
		flex-direction: column;
		flex-grow: 1;
	}

	.participant-thumb {
		/* width: 25px;
		height: 25px;
		border-radius: 50%; */
		margin-right: 10px;
	}

	.message-timestamp {
		padding: 2px 7px;
		border-radius: 15px;
		margin: 0;
		max-width: 50%;
		overflow-wrap: break-word;
		text-align: left;
		font-size: 10px;
		color: #bdb8b8;
		width: 100%;
		display: flex;
		align-items: center;
	}

	.message-text {
		background: #fff;
		padding: 6px 10px;
		line-height: 14px;
		border-radius: 15px;
		margin: 5px 0 5px 0;
		max-width: 70%;
		overflow-wrap: break-word;
		text-align: left;
		white-space: pre-wrap;
		border-bottom-left-radius: 0px;
		word-break: break-word;
	}
}
</style>