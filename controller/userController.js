const csv = require("csvtojson");
const userSchema = require("../model/userSchema");
const { addToDataBase } = require("./operations");
const agentSchema = require("../model/agentSchema");
const policySchema = require("../model/policySchema");
const accountSchema = require("../model/accountSchema");

module.exports = {
  deleteDoc: async (req, res) => {
    try {
      const { id, page } = req.params;
      const result = await userSchema.deleteOne({ _id: id });
      res.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
    }
  },
  UpdateData: async (req, res) => {
    try {
      const data = req.body;
      let agentUpdate;
      let policyUpdate;
      let accountUpdate;
      if (data.agentId) {
        agentUpdate = agentSchema.updateOne(
          { _id: data.agentId._id },
          { $set: data.agentId }
        );
      }
      if (data.policyId) {
        policyUpdate = policySchema.updateOne(
          { _id: data.policyId._id },
          { $set: data.policyId }
        );
      }
      if (data.accountId) {
        accountUpdate = accountSchema.updateOne(
          { _id: data.accountId._id },
          { $set: data.accountId }
        );
      }
      const userUpdate = userSchema.updateOne(
        { _id: data._id },
        { $set: data }
      );

      Promise.allSettled([
        agentUpdate,
        policyUpdate,
        accountUpdate,
        userUpdate,
      ]).then((results) => {
        userSchema
          .find({})
          .populate("agentId")
          .populate("accountId")
          .populate("policyId")
          .limit(10)
          .then((output) => {
            res
              .status(201)
              .json({ message: "User Updated Successfully", data: output });
          });
      });
    } catch (error) {
      console.log(error);
    }
  },
  clearData: (req, res) => {
    try {
      accountSchema.deleteMany({}).then(() => {});
      agentSchema.deleteMany({}).then(() => {});
      policySchema.deleteMany({}).then(() => {});
      userSchema.deleteMany({}).then(() => {});
      res.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
    }
  },
  getAllDatas: async (req, res) => {
    try {
      const { role } = req.params;
      let data = await agentSchema.find({});
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.log(error);
    }
  },
  getAllDocumnets: async (req, res) => {
    try {
      let data = await userSchema.find({});
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.log(error);
    }
  },
  getAllFiles: async (req, res) => {
    try {
      const size = parseInt(req.params.size);
      const result = await userSchema
        .find({})
        .populate("agentId")
        .populate("accountId")
        .populate("policyId")
        .skip(size)
        .limit(10);
      const totalCount = await userSchema.countDocuments();
      res.status(200).json({ success: true, data: result, length: totalCount });
    } catch (error) {
      console.log(error);
    }
  },
  addFile: (req, res) => {
    try {
      let uniqueUsersArray;
      csv()
        .fromFile(req.file.path)
        .then(async (data) => {
          const AgentsSet = new Set();
          const policySet = new Set();
          const accountSet = new Set();
          const userSet = new Set();
          let agentId;
          let policyId;
          let accountId;
          let userId;
          let count = 0;
          for (const item of data) {
            if (count === 10) {
              userSchema
                .find({})
                .populate("agentId")
                .populate("accountId")
                .populate("policyId")
                .limit(10)
                .then((output) => {
                  res
                    .status(200)
                    .json({
                      success: true,
                      data: output,
                      length: data.length,
                      count,
                    });
                });
            }
            if (!AgentsSet.has(item.agent)) {
              agentId = addToDataBase(agentSchema, {
                agent: item.agent,
              });
              AgentsSet.add(item.agent);
            }

            if (!policySet.has(item.policy_number)) {
              policyId = addToDataBase(policySchema, {
                policy_mode: item.policy_mode,
                policy_number: item.policy_number,
                policy_type: item.policy_type,
                policy_start_date: item.policy_start_date,
                policy_end_date: item.policy_end_date,
              });
              policySet.add(item.policy_number);
            }

            if (!accountSet.has(item.account_name)) {
              accountId = addToDataBase(accountSchema, {
                premium_amount: item.premium_amount,
                account_name: item.account_name,
                account_type: item.account_type,
              });
              accountSet.add(item.account_name);
            }

            if (!userSet.has(item.firstname)) {
              const results = await Promise.allSettled([
                agentId,
                accountId,
                policyId,
              ]);
              const [resolvedAgentId, resolvedAccountId, resolvedPolicyId] =
                results.map((result) => result.value);

              userId = await addToDataBase(userSchema, {
                firstname: item.firstname,
                userType: item.userType,
                company_name: item.company_name,
                category_name: item.category_name,
                csr: item.csr,
                email: item.email,
                city: item.city,
                phone: item.phone,
                address: item.address,
                state: item.state,
                zip: item.zip,
                dob: item.dob,
                producer: item.producer,
                agentId: resolvedAgentId,
                accountId: resolvedAccountId,
                policyId: resolvedPolicyId,
              });
              count++;
              console.log(count + "documents inserted..");
              userSet.add(item.firstname);
            }
          }
        })
        .catch(({ message }) => {
          res.status(500).json({ success: false, message });
        });
    } catch ({ message }) {
      res.status(500).json({ success: false, message });
    }
  },
};
