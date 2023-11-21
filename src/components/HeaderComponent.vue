<script lang="ts" setup>
import {computed, useSlots} from "vue";
import {useStore} from "vuex";
import type Participant from "@/Types/Participant";

withDefaults(
	defineProps<{
		colors: any,
		borderStyle: any,
		hideCloseButton: boolean,
		closeButtonIconSize: string,
	}>(), {
		hideCloseButton: false,
		closeButtonIconSize: '15px',
		borderStyle: () => ({
			topLeft: "10px",
			topRight: "10px",
			bottomLeft: "10px",
			bottomRight: "10px",
		})
	}
)

const slots = useSlots()
const store = useStore()
const emits = defineEmits(['onClose'])

const participants = computed<Array<Participant>>(() => store.state.participants)

const myself = computed<Participant>(() => store.state.myself)

const chatTitle = computed<String>(() => store.state.chatTitle)

const hasHeaderSlot = computed<boolean>(() => !!slots['header'])

const onClose = (): void => emits("onClose")
</script>

<template>
	<div :style="{background: colors.header.bg}" class="header-container">
		<slot :chatTitle="chatTitle" :colors="colors" :myself="myself"
		      :participants="participants"
		      name="header"></slot>

		<div v-if="!hasHeaderSlot" class="header-title">
			<p :style="{color: colors.header.text}" class="header-title-text">{{ chatTitle }}</p>

			<p class="header-participants-text">
				<span>{{ myself.name }}, </span>

				<span v-for="(participant, index) in participants" :key="participant.id">
					{{ participant.name }}{{ participants.length - index - 1 ? ', ' : '' }}
				</span>
			</p>
		</div>

		<div v-if="!hideCloseButton && !hasHeaderSlot" class="header-exit">
			<slot name="close-button">
				<a :style="{fontSize: closeButtonIconSize}" class="header-exit-button" href="#"
				   @click.prevent="onClose">✕</a>
			</slot>
		</div>
	</div>
</template>

<style lang="scss">
.quick-chat-container .header-container {
	height: 70px;
	display: flex;
	padding: 0 20px 0 10px;
	align-items: center;
	-webkit-box-shadow: 0 2px 20px 2px rgba(90, 90, 90, 0.47);
	box-shadow: 0 2px 20px 2px rgba(90, 90, 90, 0.47);
	z-index: 5;

	.header-title {
		padding: 10px;
		flex: 1;
		text-align: left;

		&-text {
			margin-bottom: 0;
		}
	}

	.header-participants-text {
		color: #e4e4e4;
		font-size: 12px;
		margin-top: 5px;
		max-height: 30px;
		overflow: hidden;
	}

	.header-exit-button {
		text-decoration: none;
		color: #fff;
		font-size: 20px;
	}

	.icon-close-chat {
		color: #fff;
		width: 100%;

		&:hover {
			color: rgb(238, 121, 121)
		}
	}
}
</style>