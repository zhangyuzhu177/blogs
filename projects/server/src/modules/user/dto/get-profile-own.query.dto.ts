import { RelationRawDto } from "src/dto/relation.dto";
import { IGetProfileOwnQueryDto } from "src/types/http/user/get-profile-own.interface";

export class GetProfileOwnQueryDto
  extends RelationRawDto
  implements IGetProfileOwnQueryDto {}
