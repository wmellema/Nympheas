<template>

  <div class='monsters'>
    <div class="loading" v-if="loading">
            <div class="loading">Loading&#8230;</div>
        </div>

        <div v-if="error" class="error">
            {{ error }}
        </div>

        <ul v-if="monsters">
            <li v-for="monster in monsters">
                <img :src="monster.img_url" height="30px"></img>
                <strong>Name:</strong> {{ monster.name }}
                <monster-lg v-bind:monster="monster"></monster-lg>
            </li>
        </ul>
    </div>
  </template>
  <script>
import axios from 'axios';
export default {
    data() {
        return {
            loading: false,
            monsters: null,
            error: null,
        };
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            this.error = this.monsters = null;
            this.loading = true;
            axios
                .get('/api/monsters')
                .then(response => {
                    console.log(response);
                    this.loading = false;
                    this.monsters = response.data;
                });
        }
    }
}
</script>
