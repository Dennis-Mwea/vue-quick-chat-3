declare module "luxon" {
    export * from "luxon/src/datetime.js";
    export * as DateTime from "luxon/src/datetime.js";
}

declare module "vuex" {
    export * from "vuex/types/index.d.ts";
    export * from "vuex/types/helpers.d.ts";
    export * from "vuex/types/logger.d.ts";
    export * from "vuex/types/vue.d.ts";
}

declare module 'vue-material-design-icons/Check.vue' {
    import {DefineComponent} from "vue";

    const CheckIcon: DefineComponent<{
        size?: number;
        fillColor?: string;
        title?: string
    }>;

    export default  CheckIcon
}

declare module 'vue-material-design-icons/*.vue' {
    import {DefineComponent} from "vue";

    const IconVue: DefineComponent<{
        size?: number;
        fillColor?: string;
        title?: string
    }>;

    export default  IconVue
}
