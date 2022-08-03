export class TagWithCreatorDto {
  name: string;
  sortOrder: number;
  creator: {
    nickname: string;
    uid: string;
  };
}