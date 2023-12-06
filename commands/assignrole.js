export default {
  name: "assignrole",
  description: "get yourself a role based on your holdings",
  options: [
    {
      name: "address",
      type: 3, // String type
      description: "Algorand address",
      required: true,
    },
    {
      name: "role",
      type: 3, // String type
      description: "Pick your holdings",
      required: true,
      choices: [
        {
          name: "Single Phantom Pal",
          value: "Singlev1",
        },
        // {
        //   name: "Single Phantom V2",
        //   value: "Singlev2",
        // },
        // {
        //   name: "Four Phantom Pal",
        //   value: "Fourv1",
        // },
        {
          name: "Five Phantom Pal",
          value: "Fivev1",
        },
        // {
        //   name: "Fivev2",
        //   value: "Fivev2",
        // },
        // {
        //   name: "Fourv2",
        //   value: "Fourv2",
        // },
        // {
        //   name: "Tenv1",
        //   value: "Tenv1",
        // },
        // {
        //   name: "Tenv2",
        //   value: "Tenv2",
        // },
        // {
        //   name: "Fifteenv1",
        //   value: "Fifteenv1",
        // },
        // {
        //   name: "Fifteenv2",
        //   value: "Fifteenv2",
        // },
        // {
        //   name: "Tweentyv1",
        //   value: "Tweentyv1",
        // },
        // {
        //   name: "Tweentyv2",
        //   value: "Tweentyv2",
        // },
      ],
    },
  ],
};
