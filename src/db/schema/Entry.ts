import mongoose, { Schema } from "mongoose";

const EntrySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    url: {
      type: String,
      required: true,
    },
    accessCount: {
      type: Number,
      default: 0,
    },
    clicks: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        ipAddress: {
          type: String,
        },
        userAgent: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Entry = mongoose.model("Entry", EntrySchema);
