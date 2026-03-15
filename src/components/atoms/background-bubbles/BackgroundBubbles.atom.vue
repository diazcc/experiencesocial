<template>
    <div class="lava-background">
        <!-- SVG Filter (Oculto) que crea el efecto de líquido/aceite -->
         l
        <svg class="lava-background__filter" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="gooey-effect">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -10" result="gooey-effect" />
                    <feBlend in="SourceGraphic" in2="gooey-effect" />
                </filter>
            </defs>
        </svg>

        <!-- Contenedor al que se le aplica el filtro -->
        <div class="lava-background__blobs-container">
            <div class="lava-background__blob lava-background__blob--1"></div>
            <div class="lava-background__blob lava-background__blob--2"></div>
            <div class="lava-background__blob lava-background__blob--3"></div>
            <div class="lava-background__blob lava-background__blob--4"></div>
            <div class="lava-background__blob lava-background__blob--5"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
// Este componente es puramente visual, no requiere lógica compleja.
// Se usa como fondo absoluto dentro de un contenedor relativo.
</script>

<style scoped src="./BackgroundBubbles.atom.scss" lang="scss">
  
</style>