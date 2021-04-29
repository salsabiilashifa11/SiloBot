<template>
  <div>
    <b-navbar toggleable="lg" fixed="top" class="shadow navbar-silobot">
      <b-container>
        <b-navbar-brand href="/">
            <img class="w-25 h-auto" src="Logo-2.png" alt="logo-silobot">
        </b-navbar-brand>
        <b-navbar-toggle target="navbarNav"></b-navbar-toggle>
        <b-collapse class="text-center" id="navbarNav" is-nav>
          <b-navbar-nav class="ml-auto d-flex">
            <b-nav-item to="/" exact active-class="active" class="my-auto">
              Home
            </b-nav-item>
            <b-nav-item to="/about" class="my-auto" active-class="active">
              About
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
  </div>
</template>

<script>

export default {
  name: "Navbar"
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap");

.navbar-light .navbar-nav .show > .nav-link,
.navbar-light .navbar-nav .active > .nav-link,
.navbar-light .navbar-nav .nav-link.show,
.navbar-light .navbar-nav .nav-link.active {
  color: black;
}

.navbar-silobot {
  font-family: "Poppins", sans-serif;
  background-color: #213e3b !important;
  padding-top: 0px;
  padding-bottom: 0px;
  .logo-navbar {
    max-height: 66px;
  }

  .nav-item {
    overflow: hidden;
    white-space: nowrap;
    .nav-link {
      font-size: 16px;
    }
    :hover {
      color: #e8ffff !important;
    }
    margin-left: 24px;
    font-weight: 500;
    .nav-link.active {
        color: #e8ffff;
    }
  }
}
</style>
