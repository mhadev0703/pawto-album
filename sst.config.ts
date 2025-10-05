import type { SSTConfig } from "sst";
import { API } from "./stacks/MyStack";

export default {
  config(_input) {
    return {
      name: "pawto-album",
      region: "us-east-1",
    };
  },
  stacks(app) {
    // Set default runtime for all functions
    app.setDefaultFunctionProps({
      runtime: "nodejs20.x",
    });
    
    app.stack(API);
  }
} satisfies SSTConfig;