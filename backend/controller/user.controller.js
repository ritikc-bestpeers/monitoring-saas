import userModel from "../models/user.model.js";

const addUser = async (req, res, next) => {
  try {
    let user = await userModel.create({
      email: "ritik.c@bestpeers.com",
      password: "hello@"
    })

    res.status(200).json({
      success: true,
      message: "Monitoring started",
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong!",
    });
  }
};



export default { addUser };
