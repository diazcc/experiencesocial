<template>
    <main class="login__wrapper">
        <header class="login__wrapper__header">
            <h1 style="color:white;font-size: 24px;font-weight: lighter;">
             Andres Diaz Castillo   </h1>
        </header>
        <article
            :class="'login__wrapper__content login__wrapper__content--' + (!dataLogin.stateForm ? 'register' : '')">
           
        </article>
        <!-- <Footer class="login__wrapper__footer" :imgColor="'white'"/> -->

        <ModalAlert :dataModalAlert="dataLogin.dataModalAlert" />
        <ModalConfirmation :dataModalConfirmation="dataLogin.dataModalConfirmation" />
    </main>
</template>

<script setup lang="ts">
import SelectLangMolecule from '../../molecules/select-lang/SelectLang.molecule.vue';
import CardOptionLogin from '../../molecules/card-option-login/CardOptionLogin.molecule.vue'
import ModalAlert from '../../molecules/modals/alert/ModalAlert.molecule.vue';
import ModalConfirmation from '../../molecules/modals/confirmation/ModalConfirmation.molecule.vue';
import FormLogin from '../../organisms/form-login/FormLogin.organism.vue';
import Title from '../../atoms/title/Title.atom.vue';
import Text from '../../atoms/text/Text.atom.vue';
import OptionsLogin from '../../organisms/options-login/OptionsLogin.organism.vue';
import CardLoginNormal from '../../organisms/card-login-normal/CardLoginNormal.organism.vue';

import InputText from '../../atoms/input/InputText.atom.vue';
import Button from '../../atoms/button/Button.atom.vue';
import { useI18n } from 'vue-i18n';
import Footer from '../../organisms/footer/Footer.organism.vue';

const { t,locale } = useI18n();
defineProps(['dataLogin']);//Use defineProps for can get data in another component.


</script>
<style scoped src="./Login.template.scss"></style>