<template>
  <div>
    <transition name="fade">
      <router-view/>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'App'
};
</script>

<style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .8s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>