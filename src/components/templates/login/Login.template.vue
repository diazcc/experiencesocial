<template>
    <main class="login__wrapper">
        <article
            class='login__wrapper__content '>
           <BackgroundBubblesAtom/>
        </article>
    </main>
</template>

<script setup lang="ts">

import { useI18n } from 'vue-i18n';
import BackgroundBubblesAtom from '../../atoms/background-bubbles/BackgroundBubbles.atom.vue';

const { t,locale } = useI18n();
defineProps(['dataLogin']);//Use defineProps for can get data in another component.


</script>
<style scoped src="./Login.template.scss"></style>