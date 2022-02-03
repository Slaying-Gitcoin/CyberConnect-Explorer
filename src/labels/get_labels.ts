import * as labels from "../../ETH_labels.json";

interface Labels {
  address: string;
  label: string;
}

const samples = labels as Labels[];

export default function getLabels(addresses: string[]) {
  var result: string[] = [];
  for (var i = 0; i < addresses.length; i++) {
    for (var j = 0; j < samples.length; j++) {
      if (samples[j].address == addresses[i]) {
        result.push(samples[j].label);
        break;
      } else {
        result.push("");
      }
    }
  }

  return result;
}
