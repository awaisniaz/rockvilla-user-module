// src/seed/seed.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async onModuleInit() {
    await this.seedCategories();
  }

  async seedCategories() {
    console.log('🚀🚀🚀 Categories seeding is running');
    const categories = [
      { name: 'Action' },
      { name: 'Horror' },
      { name: 'Comedy' },
      { name: 'Animated' },
    ];

    const existingCategories = await this.categoryModel.find().exec();
    if (existingCategories.length === 0) {
      return this.categoryModel.insertMany(categories);
    } else {
      console.log('Categories already seeded');
      return 'Categories already seeded';
    }
  }
}
