export const perspective = {
  initial: {
      opacity: 0,
      rotateX: 90,
      translateY: 30,
      translateX: -20,
  },
  enter: (/** @type {number} */ i) => ({
      opacity: 1,
      rotateX: 0,
      translateY: 0,
      translateX: 0,
      transition: {
          duration: 0.15, 
          delay: 0.5 + (i * 0.01), 
          ease: [.215,.61,.355,1],
          opacity: { duration: 0.35}
      }
  }),
  exit: {
      opacity: 0,
      transition: { duration: 0.5, type: "linear", ease: [0.76, 0, 0.24, 1]}
  }
}


export const slideIn = {

  initial: {

      opacity: 0,

      y: 20

  },

  enter: (/** @type {number} */ i) => ({

      opacity: 1,

      y: 0,

      transition: { 

          duration: 0.5,

          delay: 0.75 + (i * 0.1), 

          ease: [.215,.61,.355,1]

      }

  }),

  exit: {

      opacity: 0,

      transition: { duration: 0.5, type: "tween", ease: "easeInOut"}

  }

}