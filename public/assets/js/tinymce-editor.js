$(document).ready(function () {
 const useDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
 const isSmallScreen = window.matchMedia('(max-width: 1023.5px)').matches
 tinymce.init({
   selector: '#tinymce-editor',

 })
  
})
