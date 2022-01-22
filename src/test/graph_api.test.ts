import { useQuery } from "@apollo/client";
import { GetIdentity , UserIdentity, GET_IDENTITY} from "../pages/qraph_api";



let mockData: UserIdentity;
jest.mock('@apollo/client', () => {
    //const data = { userIdentity:{address:"0x8ddD03b89116ba89E28Ef703fe037fF77451e38E" , ens:"", domain:""} };
    return {
      __esModule: true,
      useQuery: jest.fn(() => ({ mockData })),
    };
  });

test('Get address identity' , async () => {
    mockData = {address:"0x8ddD03b89116ba89E28Ef703fe037fF77451e38E" , ens:"", domain:""}
    const data = GetIdentity("0x8ddD03b89116ba89E28Ef703fe037fF77451e38E")
    expect(data.data?.userIdentity.address).toBe(mockData.address)
})