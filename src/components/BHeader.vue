<template>
  <!-- Using Bootstrap's Header template (starter code) -->
  <!-- https://getbootstrap.com/docs/5.0/examples/headers/ -->
  <div class="container">
    <header class="d-flex justify-content-center py-3" role="banner">
      <ul class="nav nav-pills">
        <li class="nav-item mx-2">
          <router-link to="/member-login" class="button" active-class="active"
            >Member Login</router-link
          >
        </li>

        <li class="nav-item mx-2">
          <router-link to="/admin-login" class="button" active-class="active"
            >Admin Login</router-link
          >
        </li>
        <li class="nav-item mx-2">
          <router-link to="/community-feed" class="button" active-class="active"
            >Community Feed</router-link
          >
        </li>

        <li class="nav-item mx-2">
          <router-link to="/feed-analytics" class="button" active-class="active"
            >Feed Analytics</router-link
          >
        </li>

        <li class="nav-item mx-2">
          <router-link to="/member-signup" class="button" active-class="active"
            >Member Sign Up</router-link
          >
        </li>

        <li class="nav-item mx-2">
          <router-link to="/user-manager" class="button" active-class="active"
            >User Manager</router-link
          >
        </li>
      </ul>
    </header>
  </div>
</template>

<script setup></script>
