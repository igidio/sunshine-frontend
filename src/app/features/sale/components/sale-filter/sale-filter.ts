import { AfterViewInit, ChangeDetectionStrategy, Component, effect, inject, Injector, signal, viewChild } from '@angular/core';
import { SelectMenuOption, UiSelectMenu } from '@/app/shared/ui/ui-select-menu/ui-select-menu';
import { firstValueFrom } from 'rxjs';
import { PaginationResponseInterface } from '@/app/shared/interfaces/common.interface';
import { CustomerInterface } from '@/app/features/customer/interfaces/customer.interface';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { runInInjectionContext } from '@angular/core';

@Component({
    selector: 'sale-filter',
    imports: [UiSelectMenu],
    templateUrl: './sale-filter.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleFilter implements AfterViewInit {
    http = inject(HttpClient);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private readonly injector = inject(Injector);

    query_params = toSignal(this.route.queryParams, {
        initialValue: this.route.snapshot.queryParams,
    });

    customer = signal<CustomerInterface | null>(null);
    selected_customer = signal<SelectMenuOption[]>([]);
    select_menu_customer = viewChild.required<UiSelectMenu>('select_menu_customer');

    min_price = signal<string>('');
    max_price = signal<string>('');

    async fetch_customers(search: string = ''): Promise<SelectMenuOption[]> {
        const res = await firstValueFrom(
            this.http.get<PaginationResponseInterface<CustomerInterface>>('/api/customer', {
                params: { search },
            }),
        );
        return res.data.map<SelectMenuOption>((customer) => ({
            name: `${customer.profile.first_name} ${customer.profile.last_name}`,
            label: `${customer.profile.first_name} ${customer.profile.last_name}`,
            value: customer,
        }));
    }

    constructor() {
        effect(() => {
            const params = this.query_params();
            const customer_id = params['customer_id'];

            if (!customer_id) {
                this.customer.set(null);
                this.selected_customer.set([]);
                this.select_menu_customer()?.clear_selection();
            }
        });
    }

    on_min_price_input(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.min_price.set(value);
        this.apply_price_filter();
    }

    on_max_price_input(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.max_price.set(value);
        this.apply_price_filter();
    }

    private apply_price_filter() {
        const params: Record<string, string | null> = {
            min_price: this.min_price() || null,
            max_price: this.max_price() || null,
        };

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: params,
            queryParamsHandling: 'merge',
            replaceUrl: true,
        });
    }

    async ngAfterViewInit(): Promise<void> {
        const initial_params = this.route.snapshot.queryParams;
        const initial_customer_id = initial_params['customer_id'] ?? null;
        const initial_min_price = initial_params['min_price'] ?? null;
        const initial_max_price = initial_params['max_price'] ?? null;

        if (initial_min_price) {
            this.min_price.set(initial_min_price);
        }
        if (initial_max_price) {
            this.max_price.set(initial_max_price);
        }

        if (initial_customer_id) {
            const entity = await firstValueFrom(
                this.http.get<CustomerInterface>(`/api/customer/${initial_customer_id}`),
            );
            const option: SelectMenuOption = {
                name: `${entity.profile.first_name} ${entity.profile.last_name}`,
                label: `${entity.profile.first_name} ${entity.profile.last_name}`,
                value: entity,
            };
            this.selected_customer.set([option]);
            this.customer.set(entity);
        }

        let is_initial_render = true;
        runInInjectionContext(this.injector, () => {
            effect((onCleanup) => {
                this.customer();
                if (is_initial_render) {
                    is_initial_render = false;
                    return;
                }

                const params: Record<string, string | null> = {
                    customer_id: this.customer()?.id?.toString() ?? null,
                };

                const timer = window.setTimeout(() => {
                    this.router.navigate([], {
                        relativeTo: this.route,
                        queryParams: params,
                        queryParamsHandling: 'merge',
                        replaceUrl: true,
                    });
                }, 200);

                onCleanup(() => clearTimeout(timer));
            });
        });
    }
}
