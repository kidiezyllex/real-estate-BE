import { Injectable } from '@nestjs/common';
import { HomeContractService } from '../home-contract/home-contract.service';
import { ServiceContractService } from '../service-contract/service-contract.service';
import { GuestService } from '../guest/guest.service';
import { ApiResponseType, createApiResponse } from '../utils/response.util';

@Injectable()
export class GuestContractsService {
  constructor(
    private readonly homeContractService: HomeContractService,
    private readonly serviceContractService: ServiceContractService,
    private readonly guestService: GuestService,
  ) {}

  async findAllContractsByGuest(guestId: string): Promise<ApiResponseType> {
    // Kiểm tra xem khách hàng có tồn tại hay không
    await this.guestService.findOne(guestId);

    // Lấy hợp đồng thuê nhà của khách hàng
    const homeContractsResponse =
      await this.homeContractService.findByGuest(guestId);
    const homeContracts = homeContractsResponse.data || [];

    // Lấy hợp đồng dịch vụ của khách hàng
    const serviceContractsResponse =
      await this.serviceContractService.findByGuest(guestId);
    const serviceContracts = serviceContractsResponse.data || [];

    // Kết hợp dữ liệu
    const allContracts = {
      homeContracts,
      serviceContracts,
      summary: {
        totalHomeContracts: homeContracts.length,
        totalServiceContracts: serviceContracts.length,
        totalContracts: homeContracts.length + serviceContracts.length,
      },
    };

    return createApiResponse({
      statusCode: 200,
      message: 'Lấy tất cả hợp đồng của khách hàng thành công',
      data: allContracts,
    });
  }
}
