<template>
  <footer class="site-footer">
    <div class="footer-content">
      <a href="https://twitter.com/ajshooting" target="_blank">Twitter</a> |
      <a href="https://github.com/ajshooting/menkyo-number-quiz" target="_blank">GitHub</a>
    </div>
  </footer>
</template>

<style>
/* tailwind しないの〜？ */
.site-footer {
  background-color: #f1f1f1;
  text-align: center;
  padding: 10px 0;
  position: fixed;
  width: 100%;
  bottom: 0;
  margin-top: 30px;
}

.footer-content a {
  margin: 0 10px;
  text-decoration: none;
  color: #333;
}

.footer-content a:hover {
  text-decoration: underline;
}
</style>
