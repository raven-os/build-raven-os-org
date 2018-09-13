<template>
  <div>
    <div class="create-container">

      <!--==========================
      Header
      ============================-->
      <header id="header">
        <div class="container">
          <div id="logo" class="pull-left">
            <a href="/">
              <img src="/img/raven_title.png" alt="" title="" >
            </a>
          </div>
          <nav id="nav-menu-container">
            <ul class="nav-menu">
              <li :class="{menu_active: isActive('home')}" @click="setActive('home')">
                <!--<a href="#packages-search">Search package</a>-->
                <router-link to="/" exact>Home</router-link>
              </li>
              <li :class="{menu_active: isActive('create')}" @click="setActive('create')">
                <!--<a href="/create.html">Create package</a>-->
                <router-link to="/create">Create</router-link>
              </li>
            </ul>
          </nav>
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

/* -----------------------------------
# Navigation Menu
----------------------------------- */
/* Nav Menu Essentials */
.nav-menu, .nav-menu * {
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-menu ul {
  position: absolute;
  display: none;
  top: 100%;
  left: 0;
  z-index: 99;
}

.nav-menu li {
  position: relative;
  white-space: nowrap;
}

.nav-menu > li {
  float: left;
}

.nav-menu li:hover > ul,
.nav-menu li.sfHover > ul {
  display: block;
}

.nav-menu ul ul {
  top: 0;
  left: 100%;
}

.nav-menu ul li {
  min-width: 180px;
}

/* Nav Menu Arrows */
.sf-arrows .sf-with-ul {
  padding-right: 30px;
}

.sf-arrows .sf-with-ul:after {
  content: "\f107";
  position: absolute;
  right: 15px;
  font-family: FontAwesome;
  font-style: normal;
  font-weight: normal;
}

.sf-arrows ul .sf-with-ul:after {
  content: "\f105";
}

/* Nav Meu Container */
#nav-menu-container {
  float: right;
  margin: 0;
}

@media (max-width: 768px) {
  #nav-menu-container {
    display: none;
  }
}

/* Nav Meu Styling */
.nav-menu a {
  padding: 0 8px 10px 8px;
  text-decoration: none;
  display: inline-block;
  color: var(--white);
  font-family: sans-serif;
  font-weight: 400;
  text-transform: uppercase;
  font-size: 13px;
  outline: none;
}

.nav-menu > li {
  margin-left: 10px;
}

.nav-menu > li > a:before {
  content: "";
  position: absolute;
  width: 100%;
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: var(--accent);
  visibility: hidden;
  -webkit-transform: scaleX(0);
  transform: scaleX(0);
  -webkit-transition: all 0.3s ease-in-out 0s;
  transition: all 0.3s ease-in-out 0s;
}

.nav-menu a:hover:before, .nav-menu li:hover > a:before, .nav-menu .menu_active > a:before {
  visibility: visible;
  -webkit-transform: scaleX(1);
  transform: scaleX(1);
}

.nav-menu ul {
  margin: 4px 0 0 0;
  border: 1px solid var(--primary-dark);
}

.nav-menu ul li {
  color: var(--primary);
  background: var(--primary-dark);
}

.nav-menu ul li:first-child {
  border-top: 0;
}

.nav-menu ul li a {
  padding: 10px;
  color: var(--primary);
  transition: 0.3s;
  display: block;
  font-size: 13px;
  text-transform: none;
}

.nav-menu ul li a:hover {
  background: var(--accent);
  color: var(--white);
}

.nav-menu ul ul {
  margin: 0;
}

/* Mobile Nav Toggle */
#mobile-nav-toggle {
  position: fixed;
  right: 0;
  top: 0;
  z-index: 999;
  margin: 20px 20px 0 0;
  border: 0;
  background: none;
  font-size: 24px;
  display: none;
  transition: all 0.2s;
  outline: none;
  cursor: pointer;
  color: var(--white);
}

#mobile-nav-toggle i {
  color: var(--white);
}

@media (max-width: 768px) {
  #mobile-nav-toggle {
    display: inline;
  }
}

/* Mobile Nav Styling */
#mobile-nav {
  position: fixed;
  top: 0;
  padding-top: 18px;
  bottom: 0;
  z-index: 998;
  background: rgba(52, 52, 50, 0.9);
  left: -260px;
  width: 260px;
  overflow-y: auto;
  transition: 0.4s;
}

#mobile-nav ul {
  padding: 0;
  margin: 0;
  list-style: none;
}

#mobile-nav ul li {
  position: relative;
}

#mobile-nav ul li a {
  color: var(--white);
  font-size: 16px;
  overflow: hidden;
  padding: 10px 22px 10px 15px;
  position: relative;
  text-decoration: none;
  width: 100%;
  display: block;
  outline: none;
}

#mobile-nav ul li a:hover {
  color: var(--white);
}

#mobile-nav ul li li {
  padding-left: 30px;
}

#mobile-nav ul .menu-has-children i {
  position: absolute;
  right: 0;
  z-index: 99;
  padding: 15px;
  cursor: pointer;
  color: var(--white);
}

#mobile-nav ul .menu-has-children i.fa-chevron-up {
  color: var(--accent);
}

#mobile-nav ul .menu-item-active {
  color: var(--accent);
}

#mobile-body-overly {
  width: 100%;
  height: 100%;
  z-index: 997;
  top: 0;
  left: 0;
  position: fixed;
  background: rgba(52, 52, 50, 0.9);
  display: none;
}

/* Mobile Nav body classes */
body.mobile-nav-active {
  overflow: hidden;
}

body.mobile-nav-active #mobile-nav {
  left: 0;
}

body.mobile-nav-active #mobile-nav-toggle {
  color: var(--white);
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
