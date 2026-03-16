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
            
            <div 
                v-for="bubble in bubbles" 
                :key="bubble.id"
                :style="{ 
                    transform: `translate3d(${bubble.x}px, ${bubble.y}px, 0)`,
                    width: bubble.size + 'px',
                    height: bubble.size + 'px',
                    background: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 30%, ${bubble.color} 60%, ${bubble.color} 100%)`,
                    opacity: 0.7,
                    mixBlendMode: 'multiply'
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
let animationId: number | null = null;

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
    
    // Detectar si es móvil basado en el ancho del contenedor
    const isMobile = width < 768;
    const bubbleCount = isMobile ? 12 : 25; // Reducido para mejor rendimiento
    
    // Tamaño de burbujas proporcional al ancho del contenedor
    const minSizePercent = isMobile ? 0.12 : 0.06; // Aumentado ligeramente
    const maxSizePercent = isMobile ? 0.28 : 0.18;
    const minSize = width * minSizePercent;
    const maxSize = width * maxSizePercent;
    
    // Primera pasada: crear burbujas con velocidades
    for (let i = 0; i < bubbleCount; i++) {
        const size = Math.random() * (maxSize - minSize) + minSize;
        const x = Math.random() * (width - size);
        const y = Math.random() * (height - size);
        const angle = Math.random() * 2 * Math.PI;
        const speed = Math.random() * 0.5 + 0.2; // Velocidad más baja para mejor rendimiento
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        tempBubbles.push({
            id: i,
            x,
            y,
            vx,
            vy,
            size,
            color: '#00B24D' // Color temporal
        });
    }
    
    // Segunda pasada: calcular colores basados en velocidad
    const speeds = tempBubbles.map(b => Math.sqrt(b.vx * b.vx + b.vy * b.vy));
    const minSpeed = Math.min(...speeds);
    const maxSpeed = Math.max(...speeds);
    
    tempBubbles.forEach((bubble) => {
        const speed = Math.sqrt(bubble.vx * bubble.vx + bubble.vy * bubble.vy);
        bubble.color = interpolateColor(speed, minSpeed, maxSpeed);
    });
    
    bubbles.value = tempBubbles;
};

const animate = () => {
    if (!container.value) return;
    
    const rect = container.value.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    bubbles.value.forEach(bubble => {
        // Actualizar posición
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;
        
        // Colisión con bordes (rebote)
        if (bubble.x <= 0 || bubble.x + bubble.size >= width) {
            bubble.vx *= -1;
            bubble.x = Math.max(0, Math.min(bubble.x, width - bubble.size));
        }
        if (bubble.y <= 0 || bubble.y + bubble.size >= height) {
            bubble.vy *= -1;
            bubble.y = Math.max(0, Math.min(bubble.y, height - bubble.size));
        }
    });
    
    // Continuar animación
    animationId = requestAnimationFrame(animate);
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
    
    // Iniciar animación
    if (!animationId) {
        animate();
    }
    
    // Escuchar cambios de tamaño de ventana para recalcular burbujas
    window.addEventListener('resize', () => {
        initBubbles();
    });
});

onUnmounted(() => {
    // Detener animación
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    
    window.removeEventListener('resize', initBubbles);
});
</script>
<style scoped src="./BackgroundBubbles.atom.scss" lang="scss">
  
</style>