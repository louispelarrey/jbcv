export class TrashDto {
  id?: string;
  data : {
    reference: string;
    description: string;
    address: string;
    posterId: string;
    burners?: string[];
  }
  file: any;
}
