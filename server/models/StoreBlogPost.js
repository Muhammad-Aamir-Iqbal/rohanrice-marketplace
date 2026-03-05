import mongoose from 'mongoose';

const storeBlogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, default: '' },
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
  },
  { timestamps: true, collection: 'blog_posts' }
);

export default mongoose.models.StoreBlogPost || mongoose.model('StoreBlogPost', storeBlogPostSchema);
