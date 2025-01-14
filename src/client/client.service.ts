import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import { Client } from './schemas/client.schema';
import { CreateClientDto } from './dto/create-client.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name)
    private readonly clientModel: Model<Client>,
  ) {}

  async getClient(): Promise<object> {
    const client = await this.clientModel.find();
    return { data: client };
  }

  async createClient(
    clientDto: CreateClientDto,
    file: File & { buffer: Buffer; originalname: string },
  ): Promise<object> {
    const { originalname, buffer } = file;
    const image = `${uuidv4()}${originalname}`;
    const imagePath = `./uploads/${image}`;
    fs.writeFileSync(imagePath, buffer);
    const data = {
      title: clientDto.title,
      photoLink: `${process.env.URL}${image}`,
    };
    const client = await this.clientModel.create(data);
    return { data: client };
  }

  async updateClient(
    id: string,
    clientDto: CreateClientDto,
    file: File & { buffer: Buffer; originalname: string },
  ): Promise<object> {
    if (file) {
      const { originalname, buffer } = file;
      const image = `${uuidv4()}${originalname}`;
      const imagePath = `./uploads/${image}`;
      fs.writeFileSync(imagePath, buffer);
      const data = {
        title: clientDto.title,
        photoLink: `${process.env.URL}${image}`,
      };
      const client = await this.clientModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      return { data: client };
    }
    const data = {
      title: clientDto.title,
    };
    const client = await this.clientModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    return { data: client };
  }

  async deleteClient(id: string): Promise<string> {
    await this.clientModel.findByIdAndDelete(id);
    return 'Client deleted';
  }
}
