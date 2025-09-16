// Review model
const reviewSchema = new Schema({
  appointmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  providerId: {
    type: Schema.Types.ObjectId,
    ref: 'Provider',
    required: true
  },
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: String,
  wouldRecommend: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  },
  isApproved: {
    type: Boolean,
    default: false
  }
});

const reviewModel = mongoose.models.Review || mongoose.model("Review", reviewSchema);
export default reviewModel;