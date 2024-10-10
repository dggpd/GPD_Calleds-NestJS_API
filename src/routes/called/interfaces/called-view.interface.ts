import { $Enums } from '@prisma/client';

export interface CalledView {
  type: $Enums.CalledType;
  description: string;

  status: $Enums.CalledStatus;
}
