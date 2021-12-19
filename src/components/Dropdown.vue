<template>
  <div class="menu-item" >
    <a @click="isOpen = !isOpen">
      {{ title }}
    </a>
    <svg viewBox="0 0 1030 638" width="10" :class="{ flipped: isOpen}">
      <path d="M1017 68L541 626q-11 12-26 12t-26-12L13 68Q-3 49 6 24.5T39 0h952q24 0 33 24.5t-7 43.5z" fill="#000"></path>
    </svg>
    <transition name="fade" appear>
      <div class="sub-menu" v-if="isOpen">
        <div v-for="(item, i) in items" :key="i" class="menu-item">
          <a :href="item.link">{{ item.title }}</a>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'dropdown',
  props: ['title', 'items'],
  data () {
    return {
      isOpen: false
    }
  }
}
</script>

<style scoped>
a{
  cursor: pointer;
}

a:hover{
  background: white;
}

.menu-item{
  position: relative;
  background: transparent;
  border: none;
  padding: 5px;
  border-radius: 5px;
}

.sub-menu .menu-item{
  padding: 15px;
}
@media (max-width:1025px){
  .sub-menu .menu-item{
    padding: 10px;
  }
}

.sub-menu .menu-item:hover{
  background: white;
}

svg {
  width: 10px;
  margin-left: 10px;
}
.sub-menu {
  position: absolute;
  background-color: #C4C4C4;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: max-content;
  border-radius: 0px 0px 16px 16px;
  text-align: left;
}
.fade-enter-active,
.fade-leave-active {
  transition: all .5s ease-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.flipped{
  transform: rotate(180deg);
}
</style>