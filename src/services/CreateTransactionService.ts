import { getCustomRepository, getRepository } from 'typeorm';
//import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: RequestDTO): Promise<Transaction> {

    const transactionRepository = getCustomRepository(TransactionRepository);

    const categoryRepository = getRepository(Category);

    let transectionCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!transectionCategory) {
      transectionCategory = categoryRepository.create({
        title:category,
      });

      await categoryRepository.save(transectionCategory);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: transectionCategory,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
