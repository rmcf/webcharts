<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated>
      <q-toolbar class="bg-white text-grey-8">
        <!-- @click="leftDrawerOpen = !leftDrawerOpen" -->
        <q-btn
          @click="drawerLeft = !drawerLeft"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
        />
        <q-toolbar-title>
          PoA Charts
        </q-toolbar-title>

        <div>
          <q-btn
            type="a"
            href="/webcharts"
            flat
            color="red"
            icon="settings"
            label="Data"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawerLeft" content-class="q-pt-lg">
      <!-- card -->
      <div class="q-pa-md">
        <q-card class="my-card">
          <q-card-section class="bg-light-blue text-white">
            <div class="text-h5 text-center">
              <q-icon name="addchart" /> Available datasets
            </div>
          </q-card-section>

          <q-separator />
          <q-list separator>
            <q-item clickable v-ripple to="/" exact>
              <q-item-section avatar>
                <q-icon name="info_outline" />
              </q-item-section>
              <q-item-section>
                <q-item-label>About</q-item-label>
                <q-item-label caption>Info about system</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/budget">
              <q-item-section avatar>
                <q-icon name="euro_symbol" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Budget</q-item-label>
                <q-item-label caption>Budget onderzoeksprojecten</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/research-groups">
              <q-item-section avatar>
                <q-icon name="groups" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Research groups</q-item-label>
                <q-item-label caption>Research groups</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/poa-groups">
              <q-item-section avatar>
                <q-icon name="supervisor_account" />
              </q-item-section>

              <q-item-section>
                <q-item-label>PoA groups</q-item-label>
                <q-item-label caption>PoA groups</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </q-drawer>

    <q-page-container class="q-mt-md">
      <div><router-view /></div>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
  data() {
    return {
      drawerLeft: true
    };
  }
};
</script>
