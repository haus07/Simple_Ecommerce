import { BadRequestException, Controller, Get, NotFoundException, Query,Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { create } from 'domain';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { Repository } from 'typeorm';
import { OrderService } from './../order/order.service';
import { NotFoundError } from 'rxjs';
import { UpdateOrderDto } from '../order/dtos/update.dto';
import { OrderStatus } from 'src/common/enums/order-status.enum';

@Controller({
  path: 'payment',
  version:'1'
}
  )
export class PaymentController {
  constructor(private readonly paymentService: PaymentService,
              private readonly orderService:OrderService) {
  }
  @Get('create')
  async createPayment(@Query('amount') amount: number,
                     @Query('orderCode') orderCode: string,
                      @Req() req
  ) {
       let ipAddr =
      (req.headers['x-forwarded-for'] as string) ||
      req.socket.remoteAddress ||
      req.connection.remoteAddress ||
      '127.0.0.1';

    if (Array.isArray(ipAddr)) {
      ipAddr = ipAddr[0];
    }

    // Chuẩn hoá IPv6 "::ffff:127.0.0.1" -> "127.0.0.1"
      ipAddr = ipAddr.replace('::ffff:', '');
      return await this.paymentService.createPaymentUrl(orderCode,amount,ipAddr)
  }

  @Get('verify')
  async verifyVnPayPayment(@Query() query:Record<string,string>) {
    const isValid = this.paymentService.verifyVnPay(query)

    if (!isValid) {
      throw new BadRequestException('Giao dịch không hợp lệ')
    }

    const { vnp_ResponseCode, vnp_TxnRef } = query
    const order = await this.orderService.getOrderByOrderCode(vnp_TxnRef)
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng ')
    }

    const updateDtoSucceeded: UpdateOrderDto = { status: OrderStatus.SUCCEEDED }
    const updateDtoWaitForPaid : UpdateOrderDto = {status:OrderStatus.WAITFORPAID}
    
    if (vnp_ResponseCode === '00') {
      await this.orderService.updateOrder(order.id, updateDtoSucceeded)
      order.status = updateDtoSucceeded.status
    } else {
      await this.orderService.updateOrder(order.id, updateDtoWaitForPaid)
      order.status = updateDtoWaitForPaid.status
    }
    console.log(order.status)
    return {status:order.status}
  }

}
