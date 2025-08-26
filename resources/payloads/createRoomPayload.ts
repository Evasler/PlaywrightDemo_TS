import {
  roomFeature,
  roomType,
  type PostRoomHardData,
} from "../../src/types/index.js";
import { faker } from "@faker-js/faker";
import { generalUtils } from "../../src/utils/index.js";
import { UniqueEnforcer } from "enforce-unique";

const uniqueEnforcer = new UniqueEnforcer();

export function createRoomPayload(
  hardData: PostRoomHardData = {},
  existingRoomNames: string[],
) {
  const {
    type = faker.helpers.arrayElement(roomType),
    accessible = faker.datatype.boolean(),
    description = faker.lorem.paragraph(),
    image = faker.image.urlPicsumPhotos({ width: 500, height: 500 }),
    roomPrice = faker.number.int({ min: 50, max: 500 }),
    features = faker.helpers.arrayElements(roomFeature),
  } = hardData;
  const roomName = uniqueEnforcer.enforce(
    () =>
      `RM. ${generalUtils.padNumber(faker.number.int({ min: 1, max: 999 }), 3)}`,
    { exclude: existingRoomNames },
  );
  return {
    roomName,
    type,
    accessible,
    description,
    image,
    roomPrice,
    features,
  };
}
