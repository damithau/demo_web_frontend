import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HomeComponent, HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //   it('should create the component', () => {
  //     expect(component).toBeTruthy();
  //   });

  it('should display navigation links correctly', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('.feature-card');

    expect(links.length).toBe(3);
    expect(links[0]?.textContent).toContain('Manage Hotel Contracts');
    expect(links[1]?.textContent).toContain('Search Hotels');
    expect(links[2]?.textContent).toContain('View Contracts');
  });

  it('should have correct router links', () => {
    const debugElements = fixture.debugElement.queryAll(By.css('a'));
    const routerLinks = debugElements.map((de) => de.attributes['routerLink']);

    expect(routerLinks).toEqual([
      '/hotel-contract',
      '/hotel-search',
      '/view-contracts',
    ]);
  });
});
