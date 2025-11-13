// extract posts from the feed

function extractPosts() {
  const posts = document.querySelectorAll('[data-id^="urn:li:activity"]');

  posts.forEach((post) => {
    const text = post.querySelector(".update-components-text")?.innerText;
    if (text) {
      console.log("📝 Post:", text);
    }
  });
}
extractPosts();

// Select the node that will be observed for mutations
const targetNode = document.getElementsByClassName(
  "scaffold-finite-scroll_content"
)[0];

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      console.log("A child node has been added or removed.");
    } else if (mutation.type === "attributes") {
      console.log(`The ${mutation.attributeName} attribute was modified.`);
    }
  }
  //   extractPosts(mutationList.addedNodes);
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

// Later, you can stop observing
// observer.disconnect();
