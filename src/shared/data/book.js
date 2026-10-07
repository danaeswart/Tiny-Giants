// The storybook itself (not any one game).
//
// frontCover: key from images.js for the front-cover art, shown on the shelf and on
// the cover that swings open in the storybook. null = a drawn placeholder cover.
export const book = {
  title: 'Story time',
  frontCover: null,
};

// Width : height of one page. A spread (two pages side by side) is twice as wide.
// Your page PNGs fill each page edge to edge, so export them at this ratio
// (e.g. 970 × 1000 px) to avoid cropping.
export const PAGE_RATIO = 0.97;
