/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Totp {
  @Field()
  public uid!: string;

  @Field()
  public verified!: boolean;

  @Field()
  public createdAt!: number;

  @Field()
  public enabled!: boolean;
}