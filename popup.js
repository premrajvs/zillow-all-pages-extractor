document.getElementById('save-button').onclick = function() {
  var inputValue = document.getElementById('urlInput').value;
  var loader = document.getElementById('loader');

  loader.style.display = 'inline-block'; // Show loader

  // Send a message to the background script and wait for a response
  chrome.runtime.sendMessage({ url: inputValue }, function(response) {
      console.log(response.status);
      // Once the process is complete (or fails), hide the loader
      loader.style.display = 'none';
  });
};
