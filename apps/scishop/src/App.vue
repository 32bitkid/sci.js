<script setup lang="ts">
import Header from './components/Header.vue';
import Toolbar from './components/Toolbar.vue';
import SideBar from './components/Sidebar.vue';
import Stage from './components/Stage.vue';
import StatusBar from './components/StatusBar.vue';
import { useAppStoreProvider } from './data/useAppStoreProvider.ts';

useAppStoreProvider();
</script>

<template>
  <Stage />
  <Toolbar />
  <SideBar />
  <StatusBar />
  <Header />
</template>
