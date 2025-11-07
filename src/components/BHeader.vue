<template>
  <!-- Using Bootstrap's Header template (starter code) -->
  <!-- https://getbootstrap.com/docs/5.0/examples/headers/ -->
  <div class="container">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/member-login" class="nav-link" active-class="active" aria-current="page"
            >Member Login</router-link
          >
        </li>

        <li class="nav-item">
          <router-link to="/admin-login" class="nav-link" active-class="active" aria-current="page"
            >Admin Login</router-link
          >
        </li>

        <li class="nav-item">
          <router-link
            to="/community-feed"
            class="nav-link"
            active-class="active"
            aria-current="page"
            >Community Feed</router-link
          >
        </li>

        <li class="nav-item">
          <router-link
            to="/feed-analytics"
            class="nav-link"
            active-class="active"
            aria-current="page"
            >Feed Analytics</router-link
          >
        </li>

        <li class="nav-item">
          <router-link
            to="/member-signup"
            class="nav-link"
            active-class="active"
            aria-current="page"
            >Member Sign Up</router-link
          >
        </li>

        <li class="nav-item">
          <router-link to="/user-manager" class="nav-link" active-class="active" aria-current="page"
            >User Manager</router-link
          >
        </li>
      </ul>
    </header>
  </div>
</template>

<script setup></script>
