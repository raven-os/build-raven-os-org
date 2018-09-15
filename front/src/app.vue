<template>
  <div>
    <div class="create-container">

      <!--==========================
      Header
      ============================-->
      <header id="header">
        <div class="container">
          <b-navbar class="app-navbar" toggleable="md" type="dark">
          <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
            <b-navbar-brand href="/"><img src="/img/raven_title.png" alt="" title="" ></b-navbar-brand>
              <b-collapse is-nav id="nav_collapse">
                <b-navbar-nav class="ml-auto">
                  <b-nav-item to="/" exact class="nav-item" active-class="nav-item-active">Home</b-nav-item>
                  <b-nav-item to="/create" class="nav-item" active-class="nav-item-active">Create</b-nav-item>
                </b-navbar-nav>
              </b-collapse>
        </b-navbar>
          <!-- #nav-menu-container -->
        </div>
      </header>
      <!-- #header -->

      <router-view class="view"/>
      <div class="footer-push"/>
    </div>
    <!--==========================
    Footer
    ============================-->
    <footer id="footer" style="margin-top: 50px">
      <div class="footer-top">
        <div class="container"/>
      </div>
      <div class="container">
        <div class="copyright">
          &copy; Copyright
          <strong>Raven</strong>. All Rights Reserved
        </div>
        <div class="credits"/>
      </div>
    </footer>
    <!-- #footer -->
  </div>
</template>

<script>

export default {
  data () {
    return { activeItem: 'home' }
  },
  methods: {
    isActive: function (menuItem) {
      return this.activeItem === menuItem
    },
    setActive: function (menuItem) {
      this.activeItem = menuItem
    }
  }
}
</script>

<style scoped>
/* -----------------------------------
Header
----------------------------------- */
#header {
  padding: 30px 0;
  height: 92px;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  transition: all 0.5s;
  z-index: 997;
  background: var(--primary-dark);
}

#header #logo {
  float: left;
}

#header #logo h1 {
  font-size: 36px;
  margin: 0;
  padding: 6px 0;
  line-height: 1;
  font-family: sans-serif;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
}

#header #logo h1 a, #header #logo h1 a:hover {
  color: var(--white);
}

#header #logo img {
  padding: 0;
  margin: 0;
}

@media (max-width: 768px) {
  #header #logo h1 {
    font-size: 26px;
  }

  #header #logo img {
    max-height: 40px;
  }
}

#header.header-fixed {
  background: rgba(52, 52, 50, 0.9);
  box-shadow: 0px 2px 5px var(--primary-dark);
  padding: 20px 0;
  height: 72px;
  transition: all 0.5s;
}

.app-navbar {
  background-color: var(--primary-dark);
  text-transform: uppercase;
}

.nav-item {
  color: var(--white) !important;
}

.nav-item-active {
  color: var(--accent) !important;
}

/* -----------------------------------
# Footer
----------------------------------- */
.create-container {
  min-height: 100%;
  border: 5px solid transparent;
  margin: 0px auto -90px; /* header height - auto - footer height */
}

#footer {
  background: var(--primary-dark);
  box-shadow: 0px -2px 5px var(--primary-dark);
  padding: 30px 0;
  color: var(--white);
  font-size: 14px;
  width: 100%;
  height: 90px;
}

@media (max-height: 800px) {
  #footer {
    margin-top: 50px;
  }
}

.footer-push {
  height: 90px; /* same height as footer */
  border: 1px solid transparent;
}

#footer .copyright {
  text-align: center;
}

#footer .credits {
  padding-top: 10px;
  text-align: center;
  font-size: 13px;
  color: #ccc;
}

/* #footer-create {
background: var(--primary-dark);
box-shadow: 0px -2px 5px var(--primary-dark);
padding: 30px 0;
color: var(--white);
font-size: 14px;
width: 100%;
height: 90px;
margin-top: 50px;
position: absolute;
bottom: 0;
}

#footer-create .copyright {
text-align: center;
}

#footer-create .credits {
padding-top: 10px;
text-align: center;
font-size: 13px;
color: #ccc;
} */

</style>
