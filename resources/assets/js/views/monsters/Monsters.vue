<template>

  <div class='monsters'>
    <div class="loading" v-if="loading">
            <div class="loading">Loading&#8230;</div>
        </div>

        <div v-if="error" class="error">
            {{ error }}
        </div>

        <ul v-if="monsters">


        <div class="panel-group" id="accordion">


            <div class="panel panel-default" v-for="monster in monsters">
              <div class="panel-heading">
                <h4 class="panel-title">
                  <a data-toggle="collapse" data-parent="#accordion" :href="'#monster'+monster.id">{{ monster.name }}</a>
                </h4>
              </div>
              <div :id="'monster'+monster.id" class="panel-collapse collapse in">
                <monster-lg  v-bind:monster="monster"></monster-lg>

            </div>
          </div>


        </div>
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
