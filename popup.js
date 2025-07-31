document.getElementById('save-button').onclick = function() {
  var inputValue = document.getElementById('urlInput').value;
  var loader = document.getElementById('loader');
  chrome.runtime.sendMessage({ url: inputValue });

  loader.style.display = 'inline-block'; // Show loader

  // Simulate a process (e.g., sending message to Chrome extension) for 3 seconds
  setTimeout(function() {
      console.log(inputValue);

      // Once the process is complete, hide the loader
      loader.style.display = 'none';
  }, 20000000); // Adjust the time as needed
};
