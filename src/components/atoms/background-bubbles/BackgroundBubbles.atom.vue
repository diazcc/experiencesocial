<template>
    <div ref="container" :class="['background-bubbles', { 'background-bubbles--active': isActive }]">
        <!-- 1. Filtro SVG Oculto -->
        <svg class="background-bubbles__filter" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="gooey-input">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                    <!-- La matriz de color crea el contraste que fusiona los elementos -->
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="gooey" />
                    <feBlend in="SourceGraphic" in2="gooey" />
                </filter>
            </defs>
        </svg>

        <!-- 2. Capa Visual (El líquido / Lava) -->
        <div class="background-bubbles__gooey-layer">
            <!-- El fondo del input que reacciona con las burbujas -->
            <div class="background-bubbles__shape"></div>
            
            <!-- Generamos 20 burbujas dinámicamente -->
            <div 
                v-for="bubble in bubbles" 
                :key="bubble.id"
                :style="{ 
                    transform: `translate(${bubble.x}px, ${bubble.y}px)`,
                    width: bubble.size + 'px',
                    height: bubble.size + 'px',
                    backgroundColor: bubble.color
                }"
                class="background-bubbles__blob"
            ></div>
            
            <!-- Bordes (Top/Bottom) para que las burbujas se derritan al salir -->
            <div class="background-bubbles__edge background-bubbles__edge--top"></div>
            <div class="background-bubbles__edge background-bubbles__edge--bottom"></div>
        </div>

        <!-- 3. Capa Interactiva (El Input real) -->
        <input 
            type="text" 
            class="background-bubbles__field background-bubbles__shape" 
            :placeholder="placeholder"
            v-model="model"
            @input="onInput"
            @focus="onFocus"
            @blur="onBlur"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Bubble {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
}

// Props para hacerlo reutilizable
defineProps({
    placeholder: {
        type: String,
        default: 'Escribe aquí...'
    }
});

const container = ref<HTMLElement>();
const model = ref('');
const isActive = ref(false);
const bubbles = ref<Bubble[]>([]);
const animationId = ref<number>();

const interpolateColor = (speed: number, minSpeed: number, maxSpeed: number): string => {
    // Normalizar velocidad entre 0 y 1
    const normalized = (speed - minSpeed) / (maxSpeed - minSpeed);
    
    // Color oscuro (lento): Verde Frutiger Aero oscuro #00B24D (0, 178, 77)
    // Color claro (rápido): Verde Frutiger Aero brillante #66FF99 (102, 255, 153)
    const r = Math.round(0 + (102 - 0) * normalized);
    const g = Math.round(178 + (255 - 178) * normalized);
    const b = Math.round(77 + (153 - 77) * normalized);
    
    return `rgb(${r}, ${g}, ${b})`;
};

const initBubbles = () => {
    if (!container.value) return;
    const rect = container.value.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    bubbles.value = [];
    const tempBubbles: Bubble[] = [];
    
    // Primera pasada: crear burbujas con velocidades
    for (let i = 0; i < 30; i++) {
        const size = Math.random() * 200 + 30;
        const x = Math.random() * (width - size);
        const y = Math.random() * (height - size);
        const angle = Math.random() * 2 * Math.PI;
        const speed = Math.random() * 1 + 0.005;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        tempBubbles.push({
            id: i,
            x,
            y,
            vx,
            vy,
            size,
            color: '#006cd8' // Color temporal
        });
    }
    
    // Segunda pasada: calcular velocidades y asignar colores
    const speeds = tempBubbles.map(b => Math.sqrt(b.vx * b.vx + b.vy * b.vy));
    const minSpeed = Math.min(...speeds);
    const maxSpeed = Math.max(...speeds);
    
    tempBubbles.forEach((bubble, index) => {
        bubble.color = interpolateColor(speeds[index], minSpeed, maxSpeed);
    });
    
    bubbles.value = tempBubbles;
};

const animate = () => {
    if (!container.value) return;
    const rect = container.value.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    bubbles.value.forEach(bubble => {
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;

        const halfSize = bubble.size / 2;
        const padding = 2; // Pequeño padding para evitar temblor

        // Rebote en bordes (considerando la mitad de la bola)
        if (bubble.x <= -halfSize) {
            bubble.vx = Math.abs(bubble.vx); // Asegurar que va hacia adelante
            bubble.x = -halfSize + padding;
        } else if (bubble.x >= width - halfSize) {
            bubble.vx = -Math.abs(bubble.vx); // Asegurar que va hacia atrás
            bubble.x = width - halfSize - padding;
        }
        
        if (bubble.y <= -halfSize) {
            bubble.vy = Math.abs(bubble.vy); // Asegurar que va hacia abajo
            bubble.y = -halfSize + padding;
        } else if (bubble.y >= height - halfSize) {
            bubble.vy = -Math.abs(bubble.vy); // Asegurar que va hacia arriba
            bubble.y = height - halfSize - padding;
        }
    });

    animationId.value = requestAnimationFrame(animate);
};

const onInput = () => {
    // Lógica para reactividad al escribir
};

const onFocus = () => {
    isActive.value = true;
};

const onBlur = () => {
    isActive.value = false;
};

onMounted(() => {
    initBubbles();
    animate();
});

onUnmounted(() => {
    if (animationId.value) {
        cancelAnimationFrame(animationId.value);
    }
});
</script>
<style scoped src="./BackgroundBubbles.atom.scss" lang="scss">
  
</style>