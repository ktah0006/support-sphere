<template>
  <nav class="navbar navbar-expand-lg navbar-fixed-top my-navbar" role="navigation">
    <div class="navbar-inner container-fluid">
      <div class="d-flex justify-content-end">
        <button
          type="button"
          class="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#navbarLinks"
          aria-controls="navbarLinks"
          aria-expanded="false"
          aria-label="Toggle Navigation Links"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>

      <div class="collapse navbar-collapse justify-content-center" id="navbarLinks">
        <ul class="navbar-nav">
          <li class="nav-item mx-2 my-lg-0 my-2">
            <router-link to="/member-login" class="button" active-class="active"
              >Member Login</router-link
            >
          </li>

          <li class="nav-item mx-2 my-lg-0 my-2">
            <router-link to="/admin-login" class="button" active-class="active"
              >Admin Login</router-link
            >
          </li>
          <li class="nav-item mx-2 my-lg-0 my-2">
            <router-link to="/community-feed" class="button" active-class="active"
              >Community Feed</router-link
            >
          </li>

          <li class="nav-item mx-2 my-lg-0 my-2">
            <router-link to="/feed-analytics" class="button" active-class="active"
              >Feed Analytics</router-link
            >
          </li>

          <li class="nav-item mx-2 my-lg-0 my-2">
            <router-link to="/member-signup" class="button" active-class="active"
              >Member Sign Up</router-link
            >
          </li>

          <li class="nav-item mx-2 my-lg-0 my-2">
            <router-link to="/user-manager" class="button" active-class="active"
              >User Manager</router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.my-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1030;
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  width: 100vw;
}
.my-navbar .navbar-inner {
  padding-left: 0px;
  padding-right: 0px;
  top: 0;
  margin-top: 0 !important;
}

.navbar-collapse {
  padding: 0.5rem 0;
}
</style>

<script setup></script>
