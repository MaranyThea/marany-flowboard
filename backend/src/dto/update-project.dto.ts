import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
  /* eslint-disable @typescript-eslint/no-unsafe-call */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
  /* eslint-enable @typescript-eslint/no-unsafe-call */
}
