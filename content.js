// extract posts from the feed

function extractPosts(posts) {
  posts.forEach((post) => {
    // Strategy: Target the primary commentary container, which is often a large,
    // consistently named V2 wrapper.

    // 1. Try to find the most general "feed shared update" element that wraps the text.
    let commentaryContainer = post.querySelector(
      ".feed-shared-update-v2__commentary"
    );

    // 2. If that fails (for simpler posts), fall back to the generic text block.
    if (!commentaryContainer) {
      commentaryContainer = post.querySelector(".update-components-text");
    }

    // 3. If a container is found, grab all visible text from within it.
    const text = commentaryContainer?.innerText;

    if (text) {
      // Use trim() to clean up extra whitespace and " ...more" buttons
      // We rely on innerText's ability to pull all text nodes in order.
      console.log("📝 Post:", text.trim());
    }
  });
}

// Options for the observer (which mutations to observe)

// Callback function to execute when mutations are observed
// const callback = (mutationList, observer) => {
//   for (const mutation of mutationList) {
//     console.log(mutation);
//     if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
//       const posts = mutationList.addedNodes.querySelectorAll(
//         '[data-id^="urn:li:activity"]'
//       );
//       extractPosts(posts);
//     }
//   }
// };
const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    // 1. Only process when children are added
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      // 2. Loop through every single node that was added
      for (const node of mutation.addedNodes) {
        // 3. IMPORTANT: Skip non-element nodes (like the #text node you saw)
        if (node.nodeType !== Node.ELEMENT_NODE) {
          continue;
        }

        // 4. Check if the added node itself is a post
        if (node.matches('[data-id^="urn:li:activity"]')) {
          extractPosts([node]);
        }

        // 5. Check if the added node is a container that HOLDS the post(s)
        // (This is the replacement for the failing querySelectorAll)
        else {
          // Use querySelectorAll on the valid element node
          const containedPosts = node.querySelectorAll(
            '[data-id^="urn:li:activity"]'
          );
          extractPosts(containedPosts);
        }
      }
    }
  }
};

window.addEventListener("load", () => {
  const targetNode = document.getElementsByClassName(
    "scaffold-finite-scroll__content"
  )[0];
  // Create and start observer only after targetNode is confirmed
  const config = { attributes: true, childList: true, subtree: true };
  const observer = new MutationObserver(callback);

  observer.observe(targetNode, config);

  // Process initial posts
  const initialPosts = targetNode.querySelectorAll(
    '[data-id^="urn:li:activity"]'
  );
  extractPosts(initialPosts);
});
